<?php
namespace EAM\DefaultBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use EAM\DefaultBundle\Entity\Article;
use EAM\DefaultBundle\Form\Model\Article as FArticle;
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
        $article = new Article();
        
        $form = $this->createForm(new ArticleType, $article, ['action' => $this->generateUrl('eam_default_articles_doajouter'), 'method' => 'POST']);

        return array(
            'form'   => $form->createView()
        );
    }

    /**
     * @Route(path="/ajouter")
     * @Template("EAMDefaultBundle:Articles:ajouter.html.twig")
     * @Method({"POST"})
     */
    public function doAjouterAction(Request $request)
    {
        $article = new Article();
        
        $form = $this->createForm(new ArticleType, $article);

        $form->handleRequest($request);

        if ($form->isValid()) {
            $article->setDate(new \DateTime());
            $em = $this->getDoctrine()->getManager();
            $em->persist($article);
            $em->flush();

            return $this->redirect($this->generateUrl('eam_default_articles_voir', array('id' => $article->getId())));
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
     * @Template("EAMDefaultBundle:Articles:modifier.html.twig")
     * @Method({"GET"})
     */
    public function modifierAction(Request $request, $id)
    {

        $repository = $this->getDoctrine()->getManager()->getRepository('EAMDefaultBundle:Article');
        $article = $repository->find($id);

        if ($article === null) {
            throw $this->createNotFoundException('Article[id='.$id.'] inexistant.');
        }

        $dto = new FArticle();
        $dto->setId($article->getId());
        $dto->setTitre($article->getTitre());
        $dto->setContenu($article->getContenu());
        $dto->setPublication($article->getPublication());

        $form = $this->createForm(new ArticleEditType, $dto, ['action' => $this->generateUrl('eam_default_articles_domodifier', ['id' => $article->getId()]), 'method' => 'POST']);

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
     * @Template("EAMDefaultBundle:Articles:modifier.html.twig")
     * @Method({"POST"})
     */
    public function doModifierAction(Request $request)
    {

        $id = $request->get('id');
        $repository = $this->getDoctrine()->getManager()->getRepository('EAMDefaultBundle:Article');
        $article = $repository->find($id);

        $dto = new FArticle();
        $dto->setId($article->getId());
        $dto->setDateModif(new \DateTime());
        $dto->setTitre($article->getTitre());
        $dto->setContenu($article->getContenu());
        $dto->setPublication($article->getPublication());

        $form = $this->createForm(new ArticleEditType, $dto, ['action' => $this->generateUrl('eam_default_articles_domodifier', ['id' => $id ]), 'method' => 'POST']);

        $form->handleRequest($request);

        if ($form->isValid()) {

            $article->setTitre($dto->getTitre());
            $article->setDateModif($dto->getDateModif());
            $article->setContenu($dto->getContenu());
            $article->setCategories($dto->getCategories());
            $article->setPublication($dto->getPublication());

            $em = $this->getDoctrine()->getManager();
            $em->flush();
            $this->get('session')->getFlashBag()->add('info', 'Article bien modifié');

            return $this->redirect( $this->generateUrl('eam_default_articles_voir', array('id' => $article->getId())) );
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
        $repository = $em->getRepository('EAMDefaultBundle:Article');
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
        $repository = $em->getRepository('EAMDefaultBundle:Article');
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
                         ->getRepository('EAMDefaultBundle:Article')
                         ->findArticlesPublies(9, $page)
        ;

        return array(
            'articles'   => $articles,
            'page'       => $page,
            'nombrePage' => ceil(count($articles)/9)
        );
    }
}
