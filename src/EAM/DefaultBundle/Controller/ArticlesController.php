<?php
namespace EAM\DefaultBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use EAM\DefaultBundle\Entity\Article;
use EAM\DefaultBundle\Form\Model\Article as Farticle;
use EAM\DefaultBundle\Form\Type\ArticleType;
use EAM\DefaultBundle\Form\Type\ArticleEditType;
use EAM\DefaultBundle\Uploader\ImageUploader;

/**
 * @Route("/articles")
 */
class ArticlesController extends Controller
{

    /**
     * @Route(path="/ajouter")
     * @Template
     * @Method({"GET"})
     */
    public function ajouterAction(Request $request)
    {
        $username = $this->getUser()->getUsername();
        
        $article = new Article();
        $article->setAuteur($username);
        
        $form = $this->createForm(new ArticleType, $article, ['action' => $this->generateUrl('radiometal_default_articles_doajouter'), 'method' => 'POST']);

        return array(
            'form'   => $form->createView()
        );
    }

    /**
     * @Route(path="/ajouter")
     * @Template("RadioMetalDefaultBundle:Articles:ajouter.html.twig")
     * @Method({"POST"})
     */
    public function doAjouterAction(Request $request)
    {
        $username = $this->getUser()->getUsername();
        
        $article = new Article();
        $article->setAuteur($username);
        
        $form = $this->createForm(new ArticleType, $article);

        $form->handleRequest($request);

        if ($form->isValid()) {
            if ($article->getImage()) {
                $name = $article->getImage()->getFile()->getClientOriginalName();

                $uploader = new ImageUploader($this->container);
                $uploader->upload($article->getImage()->getFile());

                $article->getImage()->setUrl($uploader->getUploadDir().'/'.$name)->setAlt($name);
            }

            $em = $this->getDoctrine()->getManager();
            $em->persist($article);
            $em->flush();

            return $this->redirect($this->generateUrl('voir', array('id' => $article->getId())));
        }

        return array(
            'form'   => $form->createView()
        );
    }

    /**
     * @Route(path="/modifier/{id}",
     *        requirements={
     *            "id"="\d+"
     *        }
     * )
     * @Template("RadioMetalDefaultBundle:Articles:modifier.html.twig")
     * @Method({"GET"})
     */
    public function modifierAction(Request $request, $id)
    {

        $repository = $this->getDoctrine()->getManager()->getRepository('RadioMetalDefaultBundle:Article');
        $article = $repository->find($id);

        if ($article === null) {
            throw $this->createNotFoundException('Article[id='.$id.'] inexistant.');
        }

        $dto = new FArticle();
        $dto->setId($article->getId());
        $dto->setDateModif($article->getDateModif());
        $dto->setTitre($article->getTitre());
        $dto->setAuteur($article->getAuteur());
        $dto->setContenu($article->getContenu());
        $dto->setImage($article->getImage());
        $dto->setCategories($article->getCategories());
        $dto->setPublication($article->getPublication());

        $form = $this->createForm(new ArticleEditType, $dto, ['action' => $this->generateUrl('modifier', ['id' => $article->getId()]), 'method' => 'POST']);

        return array(
            'form'   => $form->createView(),
            'id' => $id
        );
    }

    /**
     * @Route(path="/modifier/{id}",
     *        requirements={
     *            "id"="\d+"
     *        }
     * )
     * @Template("RadioMetalDefaultBundle:Articles:modifier.html.twig")
     * @Method({"POST"})
     */
    public function doModifierAction(Request $request)
    {

        $id = $request->get('id');
        $repository = $this->getDoctrine()->getManager()->getRepository('RadioMetalDefaultBundle:Article');
        $article = $repository->find($id);

        $dto = new FArticle();
        $dto->setId($article->getId());
        $dto->setDateModif($article->getDateModif());
        $dto->setTitre($article->getTitre());
        $dto->setAuteur($article->getAuteur());
        $dto->setImage($article->getImage());
        $dto->setContenu($article->getContenu());
        $dto->setCategories($article->getCategories());
        $dto->setPublication($article->getPublication());

        $form = $this->createForm(new ArticleEditType, $dto, ['action' => $this->generateUrl('modifier', ['id' => $id ]), 'method' => 'POST']);

        $form->handleRequest($request);

        if ($form->isValid()) {

            $article->setTitre($dto->getTitre());
            $article->setDateModif($dto->getDateModif());
            $article->setContenu($dto->getContenu());
            $article->setCategories($dto->getCategories());
            $article->setPublication($dto->getPublication());

            if ($article->getImage()) {
                $name = $article->getImage()->getFile()->getClientOriginalName();

                $uploader = new ImageUploader($this->container);
                $uploader->upload($article->getImage()->getFile());

                $article->getImage()->setUrl($uploader->getUploadDir().'/'.$name)->setAlt($name);
            }

            $em = $this->getDoctrine()->getManager();
            $em->flush();
            $this->get('session')->getFlashBag()->add('info', 'Article bien modifié');

            return $this->redirect( $this->generateUrl('voir', array('id' => $article->getId())) );
        }

        return array(
            'form'   => $form->createView(),
            'id' => $id
        );
    }

    /**
     * @Route(path="/supprimer/{id}",
     *        requirements={
     *            "id"="\d+"
     *        },
     * )
     * @Template
     * @Method({"GET"})
     */
    public function supprimerAction($id)
    {
       
        $form = $this->createFormBuilder()->getForm();

        $em = $this->getDoctrine()->getManager();
        $repository = $em->getRepository('RadioMetalDefaultBundle:Article');
        $article = $repository->find($id);

        if ($article === null) {
            throw $this->createNotFoundException('Article[id='.$id.'] inexistant.');
        }

        return array(
            'article' => $article,
            'form'    => $form->createView()
        );
    }

    /**
     * @Route(path="/supprimer/{id}", requirements={
     *      "id"="\d+"
     * })
     * @Template
     * @Method({"POST"})
     */
    public function supprimerPostAction($id)
    {
        $em = $this->getDoctrine()->getManager();
        $repository = $em->getRepository('RadioMetalDefaultBundle:Article');
        $article = $repository->find($id);

        if ($article === null) {
            throw $this->createNotFoundException('Article[id='.$id.'] inexistant.');
        }
        $this->get('session')->getFlashBag()->add('info', 'Article bien supprimé');

        // Ici, on gérera la suppression de l'article en question
        $em->remove($article);
        $em->flush();

        return $this->redirect( $this->generateUrl('accueil') );
    }

    /**
     * @Route(
     *     path="/voir/{id}",
     *     requirements={"id"="\d+"}
     *  )
     * @Template
     * @Method({"GET"})
     */
    public function voirAction(Article $article)
    {
        return array(
            'article' => $article
        );
    }

    /**
     * @Route(path="/articles-{page}", requirements={"page"="\d+"})
     * @Template
     * @Method({"GET"})
     */
    public function allAction($page = 1)
    {
        $articles = $this->getDoctrine()
                         ->getManager()
                         ->getRepository('RadioMetalDefaultBundle:Article')
                         ->findArticlesPublies(9, $page)
        ;

        return array(
            'articles'   => $articles,
            'page'       => $page,
            'nombrePage' => ceil(count($articles)/9)
        );
    }
}
