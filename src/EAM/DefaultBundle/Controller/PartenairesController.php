<?php

namespace EAM\DefaultBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use EAM\DefaultBundle\Entity\Partenaire;
use EAM\DefaultBundle\Form\Type\PartenaireType;
use EAM\DefaultBundle\Uploader\ImageUploader;

/**
 * @Route("/admin/partenaires")
 */
class PartenairesController extends Controller
{
    /**
     * @Route("/")
     * @Method({"GET"})
     * @Template
     */
    public function allAction(Request $request)
    {
        $em = $this->getDoctrine()->getManager();

        $partenaires = $em->getRepository('EAMDefaultBundle:Partenaire')->findAll();
        return array(
            'partenaires' => $partenaires
        );
    }

    /**
     * @Route("/ajouter")
     * @Method({"GET"})
     * @Template
     */
    public function addPartenaireAction(Request $request)
    {
        $partenaire = new Partenaire();
        $form = $this->createForm(new PartenaireType(), $partenaire, array(
            'action' => $this->generateUrl('eam_default_partenaires_dopartenaire'),
            'method' => 'POST',
            'attr' => array(
                'novalidate' => 'novalidate'
            )
        ));

        return [
            'form' => $form->createView(),
        ];
    }

    /**
     * @Route("/add-partenaire")
     * @Method({"POST"})
     * @Template("EAMDefaultBundle:Galleries:addPartenaire.html.twig")
     */
    public function doPartenaireAction(Request $request)
    {
        $partenaire = new Partenaire();
        $form = $this->createForm(new PartenaireType(), $partenaire, array(
            'action' => $this->generateUrl('eam_default_partenaires_dopartenaire'),
            'method' => 'POST',
            'attr' => array(
                'novalidate' => 'novalidate'
            )
        ));

        $success = false;
        $form->handleRequest($request);
        if ($form->isValid()) {
            $name = $partenaire->getImage()->getClientOriginalName();

            $uploader = new ImageUploader($this->container);
            $uploader->upload($partenaire->getImage());

            $partenaire->setImage($uploader->getUploadDir().'/'.$name);

            $em = $this->getDoctrine()->getManager();
            $em->persist($partenaire);
            $em->flush();

            $success = true;
        }

        if ($success) {
            return $this->redirect($this->generateUrl('eam_default_partenaires_all'));
        }

        return array(
            'form' => $form->createView(),
            'success' => $success
        );
    }

    /**
     * @Route("/edit-partenaire-{id}", requirements={
     *            "id"="\d+"
     *        })
     * @Method({"GET"})
     * @Template("EAMDefaultBundle:Galleries:addPartenaire.html.twig")
     */
    public function editPartenaireAction(Request $request, $id)
    {
        $repository = $this->getDoctrine()->getManager()->getRepository('EAMDefaultBundle:Partenaire');
        $partenaire = $repository->find($id);

        if ($partenaire === null) {
            throw $this->createNotFoundException('Partenaire[id='.$id.'] inexistant.');
        }

        $form = $this->createForm(new PartenaireType(), $partenaire, array(
            'action' => $this->generateUrl('eam_default_partenaires_doeditpartenaire', ['id' => $partenaire->getId() ]),
            'method' => 'POST',
            'attr' => array(
                'novalidate' => 'novalidate'
            )
        ));

        return array(
            'form' => $form->createView()
        );

    }

    /**
     * @Route("/edit-partenaire-{id}", requirements={
     *            "id"="\d+"
     *        })
     * @Method({"POST"})
     * @Template("EAMDefaultBundle:Galleries:addPartenaire.html.twig")
     */
    public function doEditPartenaireAction(Request $request, $id)
    {
        $repository = $this->getDoctrine()->getManager()->getRepository('EAMDefaultBundle:Partenaire');
        $partenaire = $repository->find($id);

        if ($partenaire === null) {
            throw $this->createNotFoundException('Partenaire[id='.$id.'] inexistant.');
        }

        $form = $this->createForm(new PartenaireType(), $partenaire, array(
            'action' => $this->generateUrl('eam_default_partenaires_doeditpartenaire', [ 'id' => $partenaire->getId() ]),
            'method' => 'POST',
            'attr' => array(
                'novalidate' => 'novalidate'
            )
        ));

        $form->handleRequest($request);

        if ($form->isValid()) {
            $name = $partenaire->getImage()->getClientOriginalName();

            $uploader = new ImageUploader($this->container);
            $uploader->upload($partenaire->getImage());

            $partenaire->setImage($uploader->getUploadDir().'/'.$name);

            $em = $this->getDoctrine()->getManager();
            $em->flush();
        }

        return array(
            'form' => $form->createView()
        );
    }

    /**
     * @Route(path="/delete-partenaire-{id}", requirements={
     *      "id"="\d+"
     * })
     * @Template
     * @Method({"GET"})
     */
    public function deletePartenaireAction($id)
    {
        $em = $this->getDoctrine()->getManager();
        $repository = $em->getRepository('EAMDefaultBundle:Partenaire');
        $partenaire = $repository->find($id);

        if ($partenaire === null) {
            throw $this->createNotFoundException('Partenaire[id='.$id.'] inexistant.');
        }
        $this->get('session')->getFlashBag()->add('info', 'partenaire bien supprimé');

        $em->remove($partenaire);
        $em->flush();

        return $this->redirect( $this->generateUrl('eam_default_partenaires_all') );
    }
}
